import React from "react";
import { render } from "@testing-library/react";
import AppContext from "src/utils/AppContext";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const customRenderComponent = (ui: any, options?: any) => {
  return render(
    <AppContext.Provider value={options.defaultContext}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
      <ToastContainer/>
    </AppContext.Provider>
  );
}

const customRenderRoutingComponent = (ui: any, options?: any) => {
  return render(
    <AppContext.Provider value={options.defaultContext}>
      <MemoryRouter initialEntries={[options.currentRoute]}>
        <Routes>
          <Route path={options.path} element={ui} />
        </Routes>
      </MemoryRouter>
      <ToastContainer/>
    </AppContext.Provider>
  );
};

// re-export everything
export * from "@testing-library/react";

export { customRenderComponent as renderWithContext };
export { customRenderRoutingComponent as renderAsRouteComponent };
