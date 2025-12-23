import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const tutorialSteps = [
    {
        title: "Step 1: Extend Your Arm",
        description: "Hold your phone with text on the screen at arm's length. Ensure the text is blurry.",
        imageId: "tutorial-step-1"
    },
    {
        title: "Step 2: Find the Clear Point",
        description: "Slowly bring the phone closer to your face. Stop immediately when the text becomes sharp and clear.",
        imageId: "tutorial-step-2"
    },
    {
        title: "Step 3: Measure the Distance",
        description: "Hold the phone steady at that exact position. Use a measuring tape to measure the distance from your eye to the phone screen in centimeters.",
        imageId: "tutorial-step-3"
    },
    {
        title: "Step 4: Record Your Result",
        description: "Enter the measured distance for each eye into the VisionTrack app. Repeat the process for the other eye, making sure to cover one eye at a time.",
        imageId: "tutorial-step-4"
    }
]

function TutorialStep({ title, description, imageId }: { title: string, description: string, imageId: string }) {
    const image = PlaceHolderImages.find(img => img.id === imageId);

    if (!image) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                    <p className="text-muted-foreground">{description}</p>
                </div>
                <div>
                     <Image
                        src={image.imageUrl}
                        alt={image.description}
                        width={600}
                        height={400}
                        data-ai-hint={image.imageHint}
                        className="rounded-lg object-cover"
                    />
                </div>
            </CardContent>
        </Card>
    )
}


export default function TutorialPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <BookOpen className="mx-auto h-12 w-12 text-primary mb-4" />
                    <h1 className="text-4xl font-bold font-headline">How to Measure Your Vision</h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Follow these simple steps to get a consistent and accurate reading.
                    </p>
                </div>

                <div className="space-y-8">
                    {tutorialSteps.map((step, index) => (
                        <TutorialStep
                            key={index}
                            title={step.title}
                            description={step.description}
                            imageId={step.imageId}
                        />
                    ))}
                </div>

                <Card className="mt-12 bg-secondary">
                    <CardHeader>
                        <CardTitle>Important Disclaimer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            This tool provides an estimation based on optical principles and is intended for informational purposes only. It is not a substitute for a professional eye examination by a qualified optometrist or ophthalmologist. Always consult with an eye care professional for any concerns about your vision.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
