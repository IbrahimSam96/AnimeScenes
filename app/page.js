import AppComponent from "./Components/appComponent";

export default function Home() {
  return (
    <>
      < div className={`h-full min-h-screen w-full grid grid-cols-[repeat(7,1fr)] `}>
        <AppComponent />
      </div>
    </>
  )
}
