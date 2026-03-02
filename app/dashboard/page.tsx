import { getConsumptionAmountAction } from "@/actions/consumption"
import Dashboard from "./components/Dashboard"
import { formatDate } from "./utils/formatDate"

export default async function DashboardPage() {
  const waterLevel = await getConsumptionAmountAction(formatDate(new Date()))

  return <Dashboard waterLevel={Number(waterLevel.data)} />
}
