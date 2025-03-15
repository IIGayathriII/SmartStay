// pages/hostels/[id].tsx
import { useState } from 'react';
import Image from 'next/image';
import { StarIcon } from 'lucide-react';

// TypeScript interfaces
interface Amenity {
  id: string;
  name: string;
  icon: string;
}

interface HostelImage {
  id: string;
  url: string;
  alt: string;
}

interface SellerInfo {
  id: string;
  name: string;
  profileImage: string;
  joinedDate: string;
  responseRate: number;
  responseTime: string;
}

interface HostelDetails {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  description: string;
  images: HostelImage[];
  amenities: Amenity[];
  sellerInfo: SellerInfo;
}

// Mock data for the example
const hostelData: HostelDetails = {
  id: "hostel-123",
  name: "Backpackers Paradise",
  location: "Bangkok, Thailand",
  rating: 4.8,
  reviews: 127,
  price: 15,
  description: "A vibrant hostel in the heart of Bangkok offering comfortable beds, social common areas, and easy access to the city's main attractions. Perfect for solo travelers and groups alike.",
  images: [
    { id: "img1", url: "/api/placeholder/800/500", alt: "Hostel exterior" },
    { id: "img2", url: "/api/placeholder/800/500", alt: "Dormitory room" },
    { id: "img3", url: "/api/placeholder/800/500", alt: "Common area" },
    { id: "img4", url: "/api/placeholder/800/500", alt: "Rooftop bar" },
    { id: "img5", url: "/api/placeholder/800/500", alt: "Bathroom" }
  ],
  amenities: [
    { id: "amen1", name: "Free WiFi", icon: "wifi" },
    { id: "amen2", name: "Air Conditioning", icon: "wind" },
    { id: "amen3", name: "Breakfast Included", icon: "coffee" },
    { id: "amen4", name: "Lockers", icon: "lock" },
    { id: "amen5", name: "24/7 Reception", icon: "clock" },
    { id: "amen6", name: "Laundry Service", icon: "shirt" },
    { id: "amen7", name: "Communal Kitchen", icon: "utensils" },
    { id: "amen8", name: "Bike Rental", icon: "bike" }
  ],
  sellerInfo: {
    id: "seller123",
    name: "Sarah Johnson",
    profileImage: "/api/placeholder/80/80",
    joinedDate: "March 2020",
    responseRate: 98,
    responseTime: "within an hour"
  }
};

const HostelPage = () => {
  // State for the image gallery
  const [mainImage, setMainImage] = useState(hostelData.images[0]);
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hostel Name and Location */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{hostelData.name}</h1>
        <div className="flex items-center mt-2">
          <div className="flex items-center mr-4">
            <StarIcon size={16} className="text-yellow-500 mr-1" />
            <span className="font-medium">{hostelData.rating}</span>
            <span className="mx-1">·</span>
            <span className="text-gray-600 underline">{hostelData.reviews} reviews</span>
          </div>
          <span className="text-gray-600">{hostelData.location}</span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-96">
          <div className="md:col-span-2 md:row-span-2 relative rounded-tl-lg rounded-bl-lg overflow-hidden">
            <Image 
              src={mainImage.url} 
              alt={mainImage.alt}
              layout="fill"
              objectFit="cover"
              className="transition-transform hover:scale-105"
            />
          </div>
          {hostelData.images.slice(1, 5).map((image, index) => (
            <div 
              key={image.id}
              className={`relative overflow-hidden ${
                index === 2 ? 'rounded-tr-lg' : index === 3 ? 'rounded-br-lg' : ''
              }`}
            >
              <Image 
                src={image.url} 
                alt={image.alt}
                layout="fill"
                objectFit="cover"
                className="transition-transform hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">About this hostel</h2>
            <p className="text-gray-700">{hostelData.description}</p>
          </div>

          {/* Amenities */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
            <div className="grid grid-cols-2">
              {hostelData.amenities.map(amenity => (
                <div key={amenity.id} className="flex items-center py-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full mr-4">
                    <span className="text-gray-600">{amenity.icon.charAt(0).toUpperCase()}</span>
                  </div>
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Card */}
        <div className="md:col-span-1">
          <div className="sticky top-24 border rounded-xl shadow-lg p-6">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-2xl font-bold">${hostelData.price}</span>
                <span className="text-gray-600"> / night</span>
              </div>
              <div className="flex items-center">
                <StarIcon size={16} className="text-yellow-500 mr-1" />
                <span>{hostelData.rating}</span>
                <span className="mx-1">·</span>
                <span className="text-gray-600">{hostelData.reviews} reviews</span>
              </div>
            </div>

            {/* Dates and Guests Selector would go here in a real app */}
            <div className="border rounded-lg mb-4">
              <div className="grid grid-cols-2 divide-x">
                <div className="p-3">
                  <div className="text-xs font-semibold">CHECK-IN</div>
                  <div>Add date</div>
                </div>
                <div className="p-3">
                  <div className="text-xs font-semibold">CHECKOUT</div>
                  <div>Add date</div>
                </div>
              </div>
              <div className="border-t p-3">
                <div className="text-xs font-semibold">GUESTS</div>
                <div>1 guest</div>
              </div>
            </div>

            <button className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
              Book now
            </button>

            <div className="mt-4 text-center text-gray-500 text-sm">
              You won't be charged yet
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Seller Information */}
      <div className="mt-12 pt-8 border-t">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <Image 
              src={hostelData.sellerInfo.profileImage} 
              alt={hostelData.sellerInfo.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Hosted by {hostelData.sellerInfo.name}</h3>
            <p className="text-gray-600">Joined in {hostelData.sellerInfo.joinedDate}</p>
            <div className="flex items-center mt-1">
              <StarIcon size={16} className="text-yellow-500 mr-1" />
              <span className="mr-4">Superhost</span>
              <span className="text-gray-600">{hostelData.sellerInfo.responseRate}% response rate</span>
              <span className="mx-2">·</span>
              <span className="text-gray-600">Responds {hostelData.sellerInfo.responseTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelPage;