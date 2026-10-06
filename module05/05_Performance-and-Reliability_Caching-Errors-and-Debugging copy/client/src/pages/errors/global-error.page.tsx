import HCenteredContainer from "@/components/containers/h-centered.container"
import { useRouteError } from "react-router"
import AppError from "@/types/errors/app.error"

const GlobalErrorPage = () => {
  const error = useRouteError()
  return (
    <HCenteredContainer>
      <div className="flex flex-col items-center justify-center gap-4">
        <h3 className="text-3xl font-extrabold">Oops! Something went wrong.</h3>
        <p className="text-muted-foreground">
          Error:{" "}
          {error instanceof Error || error instanceof AppError
            ? error.message
            : "Unknown error"}
        </p>
      </div>
    </HCenteredContainer>
  )
}

export default GlobalErrorPage
