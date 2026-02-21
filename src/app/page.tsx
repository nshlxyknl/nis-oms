import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
     <main className="max-w-7xl h-screen mx-auto px-4 sm:px-6 lg:px-8 ">
      <div className="flex flex-col justify-center items-center text-center h-screen">
        <h1 className="text-4xl font-bold text-foreground mb-6 text-balance">Welcome to OMS</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Get started by signing in to your account or create a new one to begin your journey with us.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/auth">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
          <Button asChild variant="outline" size="lg">
          <a href='#f'> Learn More </a> 
          </Button>
        </div>
      </div>
    </main> 
  );
}
