import { ImageSwiper } from "./image-swiper"
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { UsersRound } from "lucide-react"
const images = [
  'https://ui.lukacho.com/_next/static/media/1.3a5bf91d.webp',
  'https://ui.lukacho.com/_next/static/media/2.6a8dd51d.webp',
  'https://ui.lukacho.com/_next/static/media/3.d95288b3.webp',
  'https://ui.lukacho.com/_next/static/media/4.0de1e023.webp'
]

export default function RealEstateCard() {
  return (
    <Card className="max-w-[400px]">
      <CardContent className="p-0">
        <ImageSwiper images={images} />
      </CardContent>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Batumi, Georgia</CardTitle>
        <p className="text-sm text-muted-foreground">5000 Kilometers away</p>
        <p className="mt-1">
          
        <UsersRound size={16} color="#666666" strokeWidth={1.25} />
          <span className="font-semibold">$200</span> night
        </p>
      </CardHeader>
    </Card>
  )
}