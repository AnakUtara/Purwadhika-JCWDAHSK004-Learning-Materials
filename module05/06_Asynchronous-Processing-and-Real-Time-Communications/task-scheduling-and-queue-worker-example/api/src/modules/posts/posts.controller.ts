import type { Request, Response } from "express";
import PostsService from "./posts.service.ts";
import redis from "../../libs/redis.ts";
import logger from "../../utils/logger.ts";

// Domain-scoped key generators
const CACHE_PREFIX = "cache:posts";

const getListCacheKey = (page: string, limit: string, search: string) =>
	`${CACHE_PREFIX}:list:page:${page}:limit:${limit}:search:${search}`;

const getDetailCacheKey = (id: string) => `${CACHE_PREFIX}:detail:${id}`;

// Helper to invalidate all post-related caches
const invalidatePostsCache = async (postId?: string) => {
	// 1. Find all list keys (e.g., cache:posts:list:*)
	const stream = redis.scanStream({
		match: `${CACHE_PREFIX}:list:*`,
	});

	const keysToDelete: string[] = [];

	for await (const resultKeys of stream) {
		keysToDelete.push(...resultKeys);
	}

	// 2. If a specific post was updated/deleted, invalidate its detail key too
	if (postId) {
		keysToDelete.push(getDetailCacheKey(postId));
	}

	// 3. Batch delete all matched keys
	if (keysToDelete.length > 0) {
		await redis.del(...keysToDelete);
		logger.info(`Invalidated ${keysToDelete.length} post cache keys.`);
	}
};

const PostsController = {
	getAll: async (req: Request, res: Response) => {
		const page = req.query.page?.toString() || "1";
		const limit = req.query.limit?.toString() || "10";
		const search = req.query.search?.toString() || "";

		// Function-scoped cache key (No race condition)
		const cacheKey = getListCacheKey(page, limit, search);

		// 1. Try fetching from cache
		const cachedPosts = await redis.get(cacheKey);

		if (cachedPosts) {
			logger.info(`⚡ CACHE HIT: ${cacheKey}`);
			const { data, meta } = JSON.parse(cachedPosts);
			return res.send({
				message: "Posts retrieved from cache!",
				data,
				meta,
			});
		}

		// 2. CACHE MISS: Query DB
		logger.info(`🐢 CACHE MISS: ${cacheKey}`);
		const { data, meta } = await PostsService.getPaginatedPosts({
			page: Number(page) || 1,
			limit: Number(limit) || 10,
			search,
		});

		// 3. Cache the result (TTL = 300s)
		await redis.setex(cacheKey, 300, JSON.stringify({ data, meta }));

		res.send({
			message: "Posts retrieved from database and cached successfully!",
			data,
			meta,
		});
	},

	getAllByAuthor: async (req: Request, res: Response) => {
		const { id, role } = req.auth;
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 10;
		const search = req.query.search?.toString() || "";

		const { data, meta } = await PostsService.getPaginatedPosts({
			page,
			limit,
			search,
			authorId: Number(id),
			role,
		});

		res.send({
			message: "Posts retrieved successfully!",
			data,
			meta,
		});
	},

	getById: async (req: Request, res: Response) => {
		const { id } = req.params;
		const cacheKey = getDetailCacheKey(id.toString());

		// Try cache first
		const cachedPost = await redis.get(cacheKey);
		if (cachedPost) {
			return res.send({
				message: "Post retrieved from cache!",
				data: JSON.parse(cachedPost),
			});
		}

		// Cache miss -> Query DB
		const post = await PostsService.getById(id.toString());
		if (post) {
			await redis.setex(cacheKey, 300, JSON.stringify(post));
		}

		res.send({
			message: "Post retrieved successfully!",
			data: post,
		});
	},

	create: async (req: Request, res: Response) => {
		const { id } = req.auth;
		const post = await PostsService.create({
			...req.body,
			author: { connect: { id } },
		});

		// Clear list caches so new post shows up on next fetch
		await invalidatePostsCache();

		res.status(201).send({
			message: "Post created successfully!",
			data: post,
		});
	},

	update: async (req: Request, res: Response) => {
		const { id } = req.params;
		const post = await PostsService.update(id.toString(), req.body);

		// Clear list caches + specific post detail cache
		await invalidatePostsCache(id.toString());

		res.send({
			message: "Post updated successfully!",
			data: post,
		});
	},

	delete: async (req: Request, res: Response) => {
		const { id } = req.params;
		const mode = req.query.mode === "hard" ? "hard" : "soft";

		if (mode === "hard") {
			await PostsService.hardDelete(id.toString());
		} else {
			await PostsService.softDelete(id.toString());
		}

		// Clear list caches + specific post detail cache
		await invalidatePostsCache(id.toString());

		res.send({
			message: `Post ${mode} deleted successfully!`,
		});
	},

	restore: async (req: Request, res: Response) => {
		const { id } = req.params;
		await PostsService.restore(id.toString());

		// Clear list caches + specific post detail cache
		await invalidatePostsCache(id.toString());

		res.send({
			message: "Post restored successfully!",
		});
	},
};

export default PostsController;
