import TaskManagerProvider from "../components/CityManage";
import MainPage from "./screens/MainPage";

export default function Home() {
    return (
        <TaskManagerProvider>
            <MainPage />
        </TaskManagerProvider>
    )
}