export interface PaymentProps{
    id: number,
    issue_date: string,
    bill_number: string,
    amount: number,
    job: {
        provider: string,
        avatar?: string,
        title: string
    },
    status: "canceled" | "paid" | "pending"
}