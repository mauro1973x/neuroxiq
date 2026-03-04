import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { logClientEvent } from "@/lib/observability";

const RouteAnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    void logClientEvent({
      event: "page_view",
      level: "info",
      category: "navigation",
      path: `${location.pathname}${location.search}`,
    });
  }, [location.pathname, location.search]);

  return null;
};

export default RouteAnalyticsTracker;
