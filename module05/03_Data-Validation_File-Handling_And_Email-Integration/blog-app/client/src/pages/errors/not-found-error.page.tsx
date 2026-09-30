import HCenteredContainer from "@/components/containers/h-centered.container"

const NotFoundErrorPage = () => {
  return (
    <HCenteredContainer>
      <div className="flex flex-col items-center justify-center gap-4">
        <h3 className="text-3xl font-extrabold">Page not found!</h3>
        <p className="text-muted-foreground">
          The page you're looking for isn't found. Please check the URL.
        </p>
      </div>
    </HCenteredContainer>
  )
}

export default NotFoundErrorPage
