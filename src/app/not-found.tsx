import { cn } from "@/lib/utils";
import React, { Suspense, useState } from "react";
import SplineErrorBoundary from "@/components/spline-error-boundary";

const Spline = React.lazy(() => import("@splinetool/react-spline"));

const NotFoundPage = () => {
  const [splineError, setSplineError] = useState(false);

  const fallbackUI = (
    <div className="text-center text-white">
      <h1 className="text-9xl font-bold mb-4">404</h1>
      <p className="text-xl text-white/70">Page not found</p>
    </div>
  );

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {splineError ? (
        fallbackUI
      ) : (
        <SplineErrorBoundary 
          fallback={fallbackUI}
          onError={() => setSplineError(true)}
        >
          <Suspense fallback={fallbackUI}>
            <Spline 
              scene="/assets/404.spline" 
              style={{ height: "100vh" }}
            />
          </Suspense>
        </SplineErrorBoundary>
      )}
    </div>
  );
};

export default NotFoundPage;
