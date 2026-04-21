import { useNavigate } from "react-router-dom";
import {
  closeDemo,
  isDemoMode,
  setDemoMode,
} from "../../shared/heplers/demoHelper";
import "./Hero.scss";
import { Button } from "../Button/Button";
import { useAppSelector } from "../../redux/hooks";

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  const handleDemoClick = () => {
    setDemoMode();
    window.location.href = "/jobs";
  };

  const handleCloseDemoClick = () => {
    closeDemo();
    window.location.href = "/";
  };

  const isDemo = isDemoMode();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="hero">
      <h1>Track your job applications in one place</h1>
      <p>Organize, manage, and never miss an opportunity again</p>
      <div className="hero__buttons">
        {isAuthenticated ? (
          <Button variant="secondary" onClick={() => navigate("/jobs")}>
            View Jobs
          </Button>
        ) : (
          <>
            {!isDemo ? (
              <>
                <Button variant="secondary" onClick={() => navigate("/signup")}>
                  Sign Up
                </Button>
                <Button variant="secondary" onClick={handleDemoClick}>
                  Try Demo
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => navigate("/signup")}>
                  Sign Up
                </Button>
                <Button variant="secondary" onClick={handleCloseDemoClick}>
                  Close Demo
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
