import { render, fireEvent, screen } from "@testing-library/react";
import ModalForm from "./ModalForm";

test("Add Component", () => {
  // const handleSubmit = jest.fn().mockImplementation((cb) => () => cb({
  //   reminder: "Hey Buy Cookies", time: "00:00",
  //   date: "2022-11-01", city: "San-Francisco"
  // }));
  const wrapper = shallow(<ModalForm isModalOpen = {true} openModal = {true} />);
  wrapper.find('form').simulate('submit');
// expect(handleSubmit).toBeCalledTimes(1);
});
