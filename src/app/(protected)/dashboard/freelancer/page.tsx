"use client";
import { CustomerProfileSidebar } from "@/app/components/layouts/sidebars/FreelancerProfileSidebar";
import { ProfileTabs } from "@/app/components/features/profile/ProfileTabs";
import { useFreelancerProfile } from "@/app/hooks/use-freelancer-profile";
import { Skill } from "@/app/types";

export default function CustomerHomePage() {
  const { profile } = useFreelancerProfile();

  const freelancer = {
    id: profile?.id || 0,
    name: profile?.user?.username || "",
    email: profile?.user?.email || "",
    phone_number: profile?.user?.phone_number || "",
    rating: profile?.average_rating || 0,
    isVerified: profile?.user?.is_active || false,
    profileCompletion: profile?.completion_rate || 0,
    summary: profile?.summary || "",
    // Créer un tableau de tags à partir des compétences
    tags:
      profile?.skills?.map((skill: Skill) => skill.name) ||
      (profile?.primary_skill ? [profile.primary_skill] : ["Freelancer"]),
    nationality: profile?.country || "",
    gender: profile?.gender || "",
    age: profile?.age || 0,
  };

  return (
    <div className="min-h-screen text-gray-800">
      <main className="container mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar - Profile */}
          <CustomerProfileSidebar profile={freelancer} />

          {/* Right content - Tabs */}
          <div className="flex-1 min-w-0">
            <ProfileTabs />
          </div>
        </div>
      </main>
    </div>
  );
}
