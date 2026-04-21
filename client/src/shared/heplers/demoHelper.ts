export const setDemoMode = () => {
  localStorage.setItem("demo", "true");
};

export const isDemoMode = () => {
  return localStorage.getItem("demo") === "true";
};

export const closeDemo = () => {
  localStorage.removeItem("demo");
};