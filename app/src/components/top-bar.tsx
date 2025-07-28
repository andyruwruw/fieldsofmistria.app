
/**
 * Topbar component for the application.
 */
export function Topbar() {
  return (
    <>
      <div className="top-bar flex items-center justify-between bg-white px-7 py-3.5 dark:bg-neutral-950 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
        <div className="flex flex-shrink-0 items-center">
          <h1 className="pl-3 font-medium">
            fieldsofmistria.app
          </h1>
        </div>

        <div className="ml-auto hidden w-full space-x-2 sm:justify-end md:flex">
          
        </div>
      </div>
    </>
  );
}