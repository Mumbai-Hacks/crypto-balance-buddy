import { cn } from "@/lib/utils";
import React, { Suspense, useState } from "react";

const Spline = React.lazy(() => import("@splinetool/react-spline"));

const NotFoundPage = () => {
  const [splineError, setSplineError] = useState(false);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {splineError ? (
        <div className="text-center text-white">
          <h1 className="text-9xl font-bold mb-4">404</h1>
          <p className="text-xl text-white/70">Page not found</p>
        </div>
      ) : (
        <Suspense 
          fallback={
            <div className="text-center text-white">
              <h1 className="text-9xl font-bold mb-4">404</h1>
              <p className="text-xl text-white/70">Loading...</p>
            </div>
          }
        >
          <Spline 
            scene="/assets/404.spline" 
            style={{ height: "100vh" }}
            onError={() => setSplineError(true)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default NotFoundPage;
