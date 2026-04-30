/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import AgriLearn from "./components/AgriLearn";
import AgriTriage from "./components/AgriTriage";
import CropEncyclopedia from "./components/CropEncyclopedia";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<AgriLearn />} />
          <Route path="/triage" element={<AgriTriage />} />
          <Route path="/crops" element={<CropEncyclopedia />} />
        </Routes>
      </Layout>
    </Router>
  );
}
