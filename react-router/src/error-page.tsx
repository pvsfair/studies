import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export default function ErrorPage() {
  const error: unknown = useRouteError();
  console.error(error);
  if (!isRouteErrorResponse(error))
    return (
      <>
        <div id='error-page'>
          <h1>Oops!</h1>
          <p>Sorry, an unexpected error has occured.</p>
          <p>
            <i>{error.message && error.message}</i>
          </p>
        </div>
      </>
    );
  return (
    <>
      <div id='error-page'>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occured.</p>
        <p>
          <i>
            {error.status} - {error.statusText}
          </i>
        </p>
      </div>
    </>
  );
}
