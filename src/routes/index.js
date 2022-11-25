import { BrowserRouter, Routes, Route } from "react-router-dom";
import Calendar from "../pages/Calendar";
import Reminders from "../pages/Reminders";

function routes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Calendar />} />
        <Route exact path="/reminders" element={<Reminders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default routes;
