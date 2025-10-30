
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface featuresProps {
    title: string;
    description: string;
    icon: string;
}

const features: featuresProps[] = [
    {
        title: "Comprehensive courses",
        description: "Access a wide range of carefully curated courses designed by industry expert",
        icon: '📚'
    },
    {
        title: "Interactive Learning",
        description: "Engage with interactive content and hands-on projects.",
        icon: '🧑‍💻'
    },
    {
        title: "Progress Tracking",
        description: "Monitor your progress and stay motivated with personalized insights.",
        icon: '📈'
    },
    {
        title: "Community Support",
        description: "Access a wide range of carefully curated courses designed by industry expert",
        icon: '📚'
    }
]

export default function Home() {
  return (
    <>
        <section className="relative py-20">
            <div className="flex flex-col items-center text-center space-y-8">
                <Badge variant="outline">
                    Revolution in online Education.
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold">Welcome to the Future of Learning</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                    Discover endless possibilities with our platform.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Link href="/courses" className={buttonVariants({ size: "lg" })}>
                        Explore Courses
                    </Link>
                    <Link href="/login" className={buttonVariants({ size: "lg", variant: "outline" })}>
                        Login
                    </Link>
                </div>
            </div>
        </section>

        <section className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
            {features.map((feature, index) => ( 
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <div className="text-xl mb-4">
                            {feature.icon}
                        </div>
                        <CardTitle>
                            {feature.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                </Card>
            ))}
        </section>
    </>
  );
}
