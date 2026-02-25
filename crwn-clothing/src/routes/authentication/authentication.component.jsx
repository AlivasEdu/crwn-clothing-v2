
import { useState } from "react";
import SignUpForm from "../../components/sign-up-form/sign-up-form.component";
import SignInForm from "../../components/sign-in-form/sign-in-form.component";

import "./authentication.styles.scss";

const defaultFormFields = {
  email: "",
  password: "",
};

const Authentication = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const {  email, password } = formFields;
  
  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      resetFormFields();
    } catch (error) {
      console.log("user sign in failed", error);
    }
  };

  
  return (
    <div className="authentication-container">
      <SignInForm />
      <SignUpForm />
    </div>
  );
};

export default Authentication;
