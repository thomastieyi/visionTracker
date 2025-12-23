export function Footer() {
    return (
        <footer className="py-6 mt-auto">
            <div className="container mx-auto text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} VisionTrack. All Rights Reserved.</p>
                <p className="mt-2 text-xs">
                    Disclaimer: This tool is for informational purposes only and is based on optical principles. It is not a substitute for a professional eye examination.
                </p>
            </div>
        </footer>
    );
}
