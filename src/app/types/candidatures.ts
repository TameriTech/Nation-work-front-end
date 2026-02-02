export interface Candidature {
  id: number,
  service_id: number,
  freelancer_id: number,
  proposed_price: number,
  estimated_duration: string,
  cover_letter: string,
  status: "en_attente" | "acceptee" | "refusee",
  application_date: string,
  updated_at: string,
  freelancer_name: string,
  freelancer_rating: number,
  freelancer_profile_picture: string,
  service_title: string,
  service_proposed_amount: number
}