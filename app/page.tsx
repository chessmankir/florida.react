import { redirect } from "next/navigation";

export default function Home() {
  redirect("/analytics/flowwow/products?status=active&linkStatus=all&availability=all&sortBy=sales&sortDirection=desc&page=1&limit=50");
}
