import { getConsumptionAmountAction } from "@/actions/consumption"
import Dashboard from "./components/Dashboard"
import { formatDate } from "./utils/formatDate"

export default async function DashboardPage() {
  const waterLevel = await getConsumptionAmountAction(formatDate(new Date()))

  if (!waterLevel.success) {
    return <div>Error: {waterLevel.message}</div>
  }

  return <Dashboard waterLevel={Number(waterLevel.data)} />
}
