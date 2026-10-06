import { createPost } from "@/api/posts.api"
import { uploadImage } from "@/api/storage.api"
import HCenteredContainer from "@/components/containers/h-centered.container"
import TextField from "@/components/fields/text.field"
import { Button } from "@/components/shadcn-ui/button"
import { Field, FieldError, FieldLabel } from "@/components/shadcn-ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/shadcn-ui/input-group"
import { Spinner } from "@/components/shadcn-ui/spinner"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn-ui/tabs"
import { Textarea } from "@/components/shadcn-ui/textarea"
import { createPostSchema, type PostCreate } from "@/validators/post.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { FileInput } from "lucide-react"
import { useEffect, useMemo } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import ReactMarkdown from "react-markdown"
import { useNavigate } from "react-router"
import remarkGfm from "remark-gfm"
import { toast } from "sonner"

// type Props = {}
const PostsCreatePage = () => {
  const navigate = useNavigate()

  const {
    handleSubmit,
    register,
    control,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<PostCreate>({
    defaultValues: {
      title: "",
      content: "",
      cover: undefined,
    },
    resolver: zodResolver(createPostSchema),
  })

  const [content, cover] = useWatch({
    control,
    name: ["content", "cover"],
  })

  const previewUrl = useMemo(() => {
    if (cover && cover instanceof File) {
      return URL.createObjectURL(cover)
    }
    return null
  }, [cover])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const onSubmit = async (data: PostCreate) => {
    try {
      console.log("Form submitted:", data)
      const { cover, ...body } = data
      const imageUrl = await uploadImage(cover as File)

      await createPost({
        ...body,
        coverUrl: imageUrl.url,
      })

      toast.success("Post created successfully!")

      navigate("/")
    } catch (error) {
      console.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : (error as Error).message
      )
      toast.error("Something went wrong. Please try again.")
      reset()
    }
  }

  return (
    <HCenteredContainer>
      <h2 className="text-xl font-bold">Create New Post</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 py-4">
        <TextField<PostCreate>
          control={control}
          label="Title"
          name="title"
          placeholder="Write title here..."
          disabled={isSubmitting}
        />
        <Controller
          control={control}
          name="cover"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { onChange, value: _, ...fieldProps } }) => {
            return (
              <Field>
                <FieldLabel htmlFor="cover">Upload cover image</FieldLabel>
                {previewUrl ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={previewUrl}
                      alt="Cover"
                      className="aspect-video w-full object-cover"
                    />
                  </div>
                ) : null}
                <InputGroup className="w-full">
                  <InputGroupAddon>
                    <FileInput />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...fieldProps}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) onChange(file)
                    }}
                  />
                </InputGroup>
                {errors.cover ? <FieldError errors={[errors.cover]} /> : null}
              </Field>
            )
          }}
        />
        <Tabs
          defaultValue="write"
          className="w-full"
          aria-disabled={isSubmitting}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="write" className="mt-2">
            <Textarea
              {...register("content")}
              placeholder="Write markdown here..."
              className="min-h-87.5 font-mono text-sm"
              disabled={isSubmitting}
            />
            {errors.content ? <FieldError errors={[errors.content]} /> : null}
          </TabsContent>

          <TabsContent value="preview" className="mt-2">
            <div className="prose min-h-87.5 max-w-none overflow-y-auto rounded-md border bg-background p-4 prose-neutral dark:prose-invert">
              {content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              ) : (
                <span className="text-sm text-muted-foreground italic">
                  Nothing to preview
                </span>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? <Spinner /> : null}
          Submit
        </Button>
      </form>
    </HCenteredContainer>
  )
}
export default PostsCreatePage
