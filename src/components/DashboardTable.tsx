"use client";

import {useState} from "react";
import Link from 'next/link';
import { getFileTypeIcon } from "@/lib/getFileIcon";

type UIData = {
  id: number;
  document: string;
  category: string;
  expiry_date: string;
  status: string;
  picture: string;
};

const TABS = ["All Documents", "Expiring Soon", "Up to Date"];

const categoryColors: { [key: string]: string } = {
  vehicle: 'bg-blue-300',
  travels: 'bg-yellow-300',
  personal: 'bg-pink-300',
  work: 'bg-purple-300',
  professional: 'bg-green-300',
  household: 'bg-teal-300',
  finance: 'bg-orange-300',
  health: 'bg-red-300',
  social: 'bg-indigo-300',
  education: 'bg-gray-300',
  other: 'bg-gray-200',
};

const DashboardTable = ({ data }: { data: UIData[] }) => {
  const [selectedTab, setSelectedTab] = useState("All Documents");

  const filteredData =
    selectedTab === "All Documents"
      ? data
      : data.filter((item) => item.status === selectedTab.toLowerCase());

  return (
    <div className="w-full p-5">
      {/* Tabs */}
      <div className="flex flex-row space-x-4 mb-5 w-max">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-6 py-3 rounded-lg border border-gray-200 ${
              selectedTab === tab ? "bgg-main bgg-hover" : "bg-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <table className="w-full min-w-[800px] border border-gray-200 rounded-md shadow-sm text-left text-gray-700">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="p-3">Document</th>
            <th className="p-3">Category</th>
            <th className="p-3">Expiry Date</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 items-center">
                <td className="p-3 flex flex-row items-center space-x-5">
                  <div className="w-9 h-9 rounded overflow-hidden flex items-center justify-center">
                    {item.picture ? (
                      (() => {
                        const type = getFileTypeIcon(item.picture);

                        if (type === 'image') {
                          return (
                            <img src={item.picture} alt={item.document} className="w-full h-full object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                          );
                        } else {
                          return (
                            <a href={item.picture} target="_blank" rel="noopener noreferrer" className="fff-main text-vvs">
                                {type.toUpperCase()}
                            </a>
                          );
                        }
                      })()
                    ) : (
                      <div className="w-full h-full bgg-main opacity-75 p-2 rounded-md">
                        <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="truncate">{item.document}</span>
                </td>
                <td className="p-3">
                  <span
                    className={`capitalize px-2 py-1 rounded text-sm font-medium 
                      ${categoryColors[item.category] || 'bg-gray-200'}`}
                  >
                    {item.category}
                  </span>
                </td>
                <td className="p-3">{item.expiry_date}</td>
                <td className="p-3">
                  <span
                    className={`capitalize px-2 py-1 rounded text-sm font-medium ${
                      item.status === 'up to date' ? 'bg-green-300' : 'bg-red-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-3 text-xs">
                  <Link href={`/documents/${item.id}`} className="fff-main">VIEW</Link>
                  <Link href={`/documents/${item.id}/edit`} className="text-gray-800 ms-5">EDIT</Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                No Documents
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
/*
Categories	Sub-Categories
Vehicle	
	Driver's License
	Vehicle Registration Certificate (VRC)
	Proof of Ownership
	Insurance Certificate
	Roadworthiness Certificate
	Vehicle License
	Hackney Permit
	Oil Change
	Maintenace
Travels	
	Ticket Booking
	Hotel Reservation
	Visa 
	International Passport
	Travel insurance
	Shopping
	Vaccinations
	
Personal	
	Milestones
	Self-Care
	Hobbies & Interests
	Personal Goals
	Donations
	
Work	
	Meetings
	Deadlines
	Communication
	Team Tasks
	Administrative
	Licence expiry
	Permits expiry
	Tax Annual Returns deadlie
	Audit Annual Returns deadlie
	
Professional	
	Membership
	Practice Licence
	Development
	Networking
	Career Planning
	Industry Awareness
	Personal Branding
	
Household	
	Bills & Payments
	Shopping
	Maintenance
	Pet Care
	Organization
Finance	
	Budgeting
	Taxes
	Subscriptions
	Investments
	Debt Management
Health	
	Health Insurance
	Appointments
	Medications
	Fitness
	Mental Health
	Check-Ups
	Nutrition
Social	
	Membership
	Connections
	Events
	Networking
	Gift-Giving
	Community
Education	
	School fees
	Assignments
	Exams
	Courses
	Library
	Extracurriculars
*/