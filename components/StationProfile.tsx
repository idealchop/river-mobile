
import React, { useState } from 'react';
import { IconBeaker, IconShieldCheck, IconClipboardList, IconPaperclip, IconStar } from './Icons.tsx';
import type { RefillingStation, WaterQualityTest, Review } from '../types.ts';
import SettingsModal from './SettingsModal.tsx';
import AttachmentModal from './AttachmentModal.tsx';
import ReviewModal from './ReviewModal.tsx';

const mockStationData: RefillingStation = {
  id: 'station-01',
  name: 'AquaPure Refilling Station',
  location: '123 River St, Makati City',
  quality: 'Excellent',
  latestTestDate: '2024-05-28',
  overallTestResultUrl: 'https://placehold.co/600x800/ffffff/333333?text=Overall+Water+Quality+Report',
  sanitationStatus: 'Excellent',
  latestSanitationDate: '2024-05-20',
  overallSanitationReportUrl: 'https://placehold.co/600x800/ffffff/333333?text=Overall+Sanitation+Report',
  tests: [
    { category: 'Physical', parameter: 'Color', result: 'Clear', status: 'Pass' },
    { category: 'Physical', parameter: 'Odor', result: 'None', status: 'Pass' },
    { category: 'Chemical', parameter: 'pH Level', result: '7.2', status: 'Pass' },
    { category: 'Chemical', parameter: 'TDS', result: '45 ppm', status: 'Pass' },
    { category: 'Biological', parameter: 'E. coli', result: 'Absent', status: 'Pass' },
    { category: 'Others', parameter: 'Microplastics', result: 'Not Detected', status: 'Pass' },
  ],
  sanitationHistory: [
    { date: '2024-05-20', notes: 'Routine monthly sanitation and filter check.', status: 'Pass' },
    { date: '2024-04-18', notes: 'UV lamp replacement and system flush.', status: 'Pass' },
  ],
  reviews: [
      { author: 'Alex S.', rating: 5, comment: 'Always great service and clean water!', date: '2024-05-22' }
  ]
};

const QualityCategory: React.FC<{ title: string; icon: React.ReactNode; tests: WaterQualityTest[]; }> = ({ title, icon, tests }) => (
  <div>
    <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><span className="w-5 h-5">{icon}</span> {title}</h4>
    <div className="space-y-2">
      {tests.map(test => (
        <div key={test.parameter} className="flex justify-between items-center p-2 bg-gray-50 rounded-md text-sm">
          <span className="text-gray-600">{test.parameter}</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-gray-500">{test.result}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${test.status === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{test.status}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StationProfile: React.FC = () => {
  const [station, setStation] = useState(mockStationData);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentTitle, setAttachmentTitle] = useState('');

  const qualityColor = station.quality === 'Excellent' ? 'text-green-500' : station.quality === 'Good' ? 'text-yellow-500' : 'text-red-500';
  const sanitationColor = station.sanitationStatus === 'Excellent' ? 'text-green-500' : station.sanitationStatus === 'Good' ? 'text-yellow-500' : 'text-red-500';

  const handleViewAttachment = (url: string, title: string) => {
    setAttachmentUrl(url);
    setAttachmentTitle(title);
    setIsAttachmentModalOpen(true);
  };

  const handleAddReview = (rating: number, comment: string) => {
    const newReview: Review = {
        author: 'You',
        rating,
        comment,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };
    setStation(prev => ({ ...prev, reviews: [newReview, ...prev.reviews] }));
    setIsReviewModalOpen(false);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">{station.name}</h3>
            <p className="text-sm text-gray-500">{station.location}</p>
          </div>
          <button onClick={() => setIsReviewModalOpen(true)} className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            <IconStar className="w-4 h-4" />
            Leave Review
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 rounded-lg p-3 text-center">
                <p className="text-sm font-semibold text-gray-600">Water Quality</p>
                <p className={`font-bold text-xl ${qualityColor}`}>{station.quality}</p>
                <p className="text-xs text-gray-400">Tested: {station.latestTestDate}</p>
                <button onClick={() => handleViewAttachment(station.overallTestResultUrl, 'Overall Test Result')} className="text-xs font-semibold text-blue-600 mt-1 hover:underline">
                    View Report
                </button>
            </div>
            <div className="bg-gray-100 rounded-lg p-3 text-center">
                <p className="text-sm font-semibold text-gray-600">Sanitation</p>
                <p className={`font-bold text-xl ${sanitationColor}`}>{station.sanitationStatus}</p>
                <p className="text-xs text-gray-400">Visited: {station.latestSanitationDate}</p>
                 <button onClick={() => handleViewAttachment(station.overallSanitationReportUrl, 'Overall Sanitation Report')} className="text-xs font-semibold text-blue-600 mt-1 hover:underline">
                    View Report
                </button>
            </div>
        </div>
        
        <div className="space-y-4 pt-2">
          <QualityCategory title="Physical & Chemical Tests" icon={<IconBeaker />} tests={station.tests.filter(t => t.category === 'Physical' || t.category === 'Chemical')} />
          <QualityCategory title="Biological & Other Tests" icon={<IconShieldCheck />} tests={station.tests.filter(t => t.category === 'Biological' || t.category === 'Others')} />
        </div>

        <div>
          <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><IconClipboardList className="w-5 h-5" /> Routine Sanitation Test</h4>
          <div className="space-y-2">
            {station.sanitationHistory.map(visit => (
              <div key={visit.date} className="p-3 bg-gray-50 rounded-md text-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-gray-700">{visit.notes}</p>
                        <p className="text-xs text-gray-500">Date: {visit.date}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${visit.status === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{visit.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AttachmentModal isOpen={isAttachmentModalOpen} onClose={() => setIsAttachmentModalOpen(false)} attachmentUrl={attachmentUrl} title={attachmentTitle} />
      <SettingsModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title={`Review for ${station.name}`}>
        <ReviewModal stationName={station.name} onSubmit={handleAddReview} />
      </SettingsModal>
    </>
  );
};

export default StationProfile;
