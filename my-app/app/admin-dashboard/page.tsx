// pages/supervisor.tsx
import React from 'react';
import Link from 'next/link';
import { HeartIcon, CheckIcon, XIcon } from 'lucide-react';

// Define the card type
interface Badge {
  emoji: string;
  label: string;
}

interface Card {
  id: string;
  image: string;
  title: string;
  status: 'approved' | 'unapproved';
  description: string;
  country: string;
  createdAt: string;
  badges: Badge[];
}

export default function SupervisorPage() {
  // Sample data for demonstration
  const sampleData: Card[] = [
    { 
      id: '1', 
      image: '/api/placeholder/600/300',
      title: 'Project Proposal 1',
      country: 'Marketing',
      description: 'New marketing campaign proposal for Q2 2025. Includes social media strategy and content creation plan.',
      status: 'unapproved', 
      createdAt: new Date().toISOString(),
      badges: [
        { emoji: '📊', label: 'Analytics' },
        { emoji: '🚀', label: 'Growth' },
        { emoji: '💻', label: 'Digital' },
        { emoji: '📱', label: 'Social Media' },
      ],
    },
    { 
      id: '2', 
      image: '/api/placeholder/600/300',
      title: 'Budget Request',
      country: 'Finance', 
      description: 'Request for additional Q2 budget allocation for the development team. Required for new tooling and infrastructure.',
      status: 'unapproved', 
      createdAt: new Date().toISOString(),
      badges: [
        { emoji: '💰', label: 'Funding' },
        { emoji: '📈', label: 'Expansion' },
        { emoji: '🔧', label: 'Tooling' },
      ],
    },
    { 
      id: '3', 
      image: '/api/placeholder/600/300',
      title: 'New Hire Request',
      country: 'HR', 
      description: 'Request for a new senior developer position for the backend team. Urgent need to support upcoming projects.',
      status: 'approved', 
      createdAt: new Date().toISOString(),
      badges: [
        { emoji: '👥', label: 'Recruitment' },
        { emoji: '💻', label: 'Development' },
        { emoji: '⏱️', label: 'Urgent' },
      ],
    },
    { 
      id: '4', 
      image: '/api/placeholder/600/300',
      title: 'Equipment Purchase',
      country: 'IT', 
      description: 'Purchase request for new office equipment including laptops and monitors for the engineering department.',
      status: 'approved', 
      createdAt: new Date().toISOString(),
      badges: [
        { emoji: '💻', label: 'Hardware' },
        { emoji: '🔌', label: 'Equipment' },
        { emoji: '🛒', label: 'Purchase' },
        { emoji: '🔧', label: 'IT Support' },
      ],
    },
  ];

  // Filter cards by status
  const approvedCards = sampleData.filter(card => card.status === 'approved');
  const unapprovedCards = sampleData.filter(card => card.status === 'unapproved');

  return (
    <div className="min-h-screen">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Supervisor Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage approval requests and view approved items
          </p>
        </div>

        <div className="space-y-8">
          {/* Unapproved Cards Section */}
          <div>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Pending Approval ({unapprovedCards.length})</h2>
            {unapprovedCards.length === 0 ? (
              <p className="text-gray-500 italic dark:text-gray-400">No pending approval requests</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unapprovedCards.map((card) => (
                  <div key={card.id} className="max-w-md rounded-lg border border-gray-200 bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div>
                      <img src={card.image} alt={card.title} className="h-48 w-full rounded-t-lg object-cover" />
                    </div>
                    
                    <div className="border-b border-gray-200 px-4 pb-4 pt-4 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium dark:text-white">{card.title}</h3>
                        <span className="rounded-full bg-red-100 text-red-800 px-2 py-1 text-xs font-medium dark:bg-red-900 dark:text-red-200">
                          {card.country}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {card.description}
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-200 px-4 py-4 dark:border-gray-700">
                      <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                        Request details
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {card.badges.map((badge) => (
                          <span
                            key={badge.label}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium dark:bg-gray-700 dark:text-gray-200"
                          >
                            <span className="mr-1">{badge.emoji}</span>
                            {badge.label}
                          </span>
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        Submitted on {new Date(card.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex px-4 py-4">
                      <Link href={`/cards/${card.id}`} className="flex-1">
                        <button className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600">
                          Review Request
                        </button>
                      </Link>
                      <button className="ml-2 flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 dark:border-gray-700">
                        <XIcon className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved Cards Section */}
          <div>
            <h2 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">Approved ({approvedCards.length})</h2>
            {approvedCards.length === 0 ? (
              <p className="text-gray-500 italic dark:text-gray-400">No approved items yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedCards.map((card) => (
                  <div key={card.id} className="max-w-md rounded-lg border border-gray-200 bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div>
                      <img src={card.image} alt={card.title} className="h-48 w-full rounded-t-lg object-cover" />
                    </div>
                    
                    <div className="border-b border-gray-200 px-4 pb-4 pt-4 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium dark:text-white">{card.title}</h3>
                        <span className="rounded-full bg-green-100 text-green-800 px-2 py-1 text-xs font-medium dark:bg-green-900 dark:text-green-200">
                          {card.country}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {card.description}
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-200 px-4 py-4 dark:border-gray-700">
                      <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                        Request details
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {card.badges.map((badge) => (
                          <span
                            key={badge.label}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium dark:bg-gray-700 dark:text-gray-200"
                          >
                            <span className="mr-1">{badge.emoji}</span>
                            {badge.label}
                          </span>
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        Approved on {new Date(card.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex px-4 py-4">
                      <Link href={`/cards/${card.id}`} className="flex-1">
                        <button className="w-full rounded-md bg-gray-500 py-2 text-white hover:bg-gray-600">
                          View Details
                        </button>
                      </Link>
                      <button className="ml-2 flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 dark:border-gray-700">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}