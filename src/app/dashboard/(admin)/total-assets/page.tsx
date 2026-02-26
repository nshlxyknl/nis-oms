import TotalCards from '@/components/cards/TotalCards';
import { Package } from 'lucide-react'

const TotalAssets = () => {
const assets = [
  { id: 1, name: "MacBook Pro 16\"", category: "Laptop", assignedTo: "Alice Johnson", status: "assigned" },
  { id: 2, name: "Dell Monitor 27\"", category: "Peripheral", assignedTo: "Bob Smith", status: "assigned" },
  { id: 3, name: "Standing Desk", category: "Furniture", assignedTo: "—", status: "available" },
  { id: 4, name: "Logitech Webcam", category: "Peripheral", assignedTo: "—", status: "maintenance" },
];


  
  return (
    <TotalCards
    title="Assets"
  items={assets}
  icon={<Package className="w-4 h-4 text-blue-600" />}
  iconBg="bg-blue-100"
  accentColor="hover:border-blue-400"
  renderSubtitle={(asset) => `${asset.category} · ${asset.assignedTo}`}
    />
  )
}

export default TotalAssets