// Packages
import { Toaster } from 'sonner';

// Local Imports
import { Topbar } from './components/top-bar';
import { Sidebar } from './components/sidebar';

// Styles
import './assets/app.global.css';
import Router from './router';

/**
 * App component that represents the main application.
 *
 * @returns The main application component.
 */
function App() {
  return (
    <>
      <div>
        <div className='sticky top-0 z-10 dark:bg-neutral-950'>
          <Topbar />
        </div>
        <div>
          <Sidebar className='hidden max-h-[calc(100vh-65px)] min-h-[calc(100vh-65px)] overflow-y-auto overflow-x-clip md:fixed md:flex md:w-72 md:flex-col' />
  
          <div className='md:pl-72'>
            <div className='flex min-h-screen border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8'>
              <Router />
            </div>
            
            <Toaster richColors />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
