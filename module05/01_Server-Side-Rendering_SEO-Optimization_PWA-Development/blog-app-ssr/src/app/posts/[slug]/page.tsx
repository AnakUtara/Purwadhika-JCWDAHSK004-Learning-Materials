type Props = {
	params: Promise<{ slug: string }>;
};
const PostDetailsPage = async ({ params }: Props) => {
	const { slug } = await params;

	const res = await fetch(`https://dummyjson.com/posts/${slug}`);
	const post = await res.json();

	return <div>PostDetailsPage {post.title}</div>;
};
export default PostDetailsPage;
