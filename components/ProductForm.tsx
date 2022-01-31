import { useRouter } from "next/router";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";

import FormTemplate from "./FormTemplate";
import Input from "./Input";
import Multiline from "./Multiline";
import userStore from "../store/userStore";
import ProductService from "../services/ProductService";
import { changeFieldValue, checkFormValid } from "../services/form-service";

const Wrapper = styled.section`
  display: flex;
`;

const formFieldStyles = css`
  margin-bottom: 1rem;
`;

const InputField = styled(Input)`
  ${formFieldStyles}
`;

const TextAreaField = styled(Multiline)`
  ${formFieldStyles}
`;

interface Props {}

const ProductForm: FC<Props> = (props) => {
  const router = useRouter();

  const [formData, setFormData] = useState<{ [key: string]: string }>({
    name: "",
    description: "",
    price: "",
  });
  const [image, setImage] = useState<File | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    const valid = checkFormValid([
      nameInputRef,
      descriptionInputRef,
      priceInputRef,
      imageInputRef,
    ]);
    setFormValid(valid);
  }, [formData]);

  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) setImage(files[0]);
  };

  const handleFormSubmit = async () => {
    ProductService.add({
      formData,
      image,
      setErrors,
      setIsLoading,
      authToken: userStore.authToken,
      router,
    });
  };

  return (
    <Wrapper>
      <FormTemplate
        submitCallback={handleFormSubmit}
        errors={errors}
        isLoading={isLoading}
        isValid={formValid}
        buttonText="Guardar"
      >
        <InputField
          ref={nameInputRef}
          value={formData.name}
          setValue={changeFieldValue("name", setFormData)}
          labelText="Nombre del producto"
          placeholderText="Nombre del producto"
          type="text"
          validators={{
            emptyStringValidator: true,
            minLengthValidator: 8,
          }}
          required
        />

        <TextAreaField
          ref={descriptionInputRef}
          value={formData.description}
          setValue={changeFieldValue("description", setFormData)}
          labelText="Descripción"
          placeholderText="Descripción"
          validators={{
            emptyStringValidator: true,
            minLengthValidator: 20,
          }}
          required
        />

        <InputField
          ref={priceInputRef}
          value={formData.price}
          setValue={changeFieldValue("price", setFormData)}
          labelText="Precio"
          placeholderText="Precio"
          type="number"
          validators={{ emptyStringValidator: true }}
          required
        />

        <InputField
          setValue={uploadImage}
          labelText="Imagen"
          placeholderText="Imagen"
          type="file"
          validators={{
            emptyStringValidator: true,
          }}
          accept="image/*"
          required
        />
      </FormTemplate>
    </Wrapper>
  );
};

export default ProductForm;
