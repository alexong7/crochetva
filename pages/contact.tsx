import Header from "@/components/Header";
import Head from "next/head";
import React, { useState } from "react";
import {
  Container,
  FormControl,
  Input,
  Textarea,
  FormLabel,
  FormErrorMessage,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { sendContactForm } from "@/utils/sendContactForm";

type Props = {};

const initValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const initTouched = {
  name: false,
  email: false,
  subject: false,
  message: false,
};

const initState = { values: initValues, isLoading: false, error: "" };

function Contact({}: Props) {
  const [state, setState] = useState(initState);
  const [touched, setTouched] = useState(initTouched);

  const { values, isLoading, error } = state;

  const toast = useToast();

  const handleChange = (e: any) =>
    setState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [e.target.name]: e.target.value,
      },
    }));

  const onBlur = (e: any) =>
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));

  const onSubmit = async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    try {
      await sendContactForm(values);
      setTouched(initTouched);
      setState(initState);
      toast({
        title: "Message Sent!",
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to send message",
      }));
    }
  };

  return (
    <div className="h-[120vh] overflow-y-scroll sm:h-[100vh]">
      <Head>
        <title>FAQ</title>
        <link rel="icon" href="/Logo2.png" />
      </Head>
      <Header />

      <div className="flex flex-col items-center justify-center">
        <h1 className="relative ml-[12px] mt-8 text-4xl uppercase tracking-[10px] underline decoration-[#FFCEEE] underline-offset-8 md:ml-0 md:text-4xl  ">
          Contact Us
        </h1>

        <Container mt={12} maxW="450px">
          {error && (
            <Text color="red.300" my={4} fontSize="xl">
              {error}
            </Text>
          )}
          <FormControl
            isRequired
            mb={5}
            isInvalid={touched.name && !values.name}
          >
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              errorBorderColor="red.300"
              value={values.name}
              onChange={handleChange}
              onBlur={onBlur}
            />
            <FormErrorMessage>Required</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            mb={5}
            isInvalid={touched.email && !values.email}
          >
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              errorBorderColor="red.300"
              value={values.email}
              onChange={handleChange}
              onBlur={onBlur}
            />
            <FormErrorMessage>Required</FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            mb={5}
            isInvalid={touched.subject && !values.subject}
          >
            <FormLabel>Subject</FormLabel>
            <Input
              type="text"
              name="subject"
              errorBorderColor="red.300"
              value={values.subject}
              onChange={handleChange}
              onBlur={onBlur}
            />
            <FormErrorMessage>Required</FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            mb={5}
            isInvalid={touched.message && !values.message}
          >
            <FormLabel>Message</FormLabel>
            <Textarea
              name="message"
              rows={4}
              errorBorderColor="red.300"
              value={values.message}
              onChange={handleChange}
              onBlur={onBlur}
            />
            <FormErrorMessage>Required</FormErrorMessage>
          </FormControl>

          <Button
            variant="outline"
            colorScheme="linkedin"
            disabled={
              !values.name ||
              !values.email ||
              !values.subject ||
              !values.message
            }
            onClick={onSubmit}
            isLoading={isLoading}
          >
            Submit
          </Button>
        </Container>
      </div>
    </div>
  );
}

export default Contact;
