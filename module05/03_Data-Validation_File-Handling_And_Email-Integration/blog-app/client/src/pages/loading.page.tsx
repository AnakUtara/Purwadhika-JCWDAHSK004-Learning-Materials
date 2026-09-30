import { Spinner } from "@/components/shadcn-ui/spinner"

const LoadingPage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-14" />
        <p className="text-lg font-medium">Loading...</p>
      </div>
    </div>
  )
}

export default LoadingPage
