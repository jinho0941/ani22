const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-slate-400 min-h-screen flex items-center justify-center'>
      {children}
    </div>
  )
}

export default Layout
