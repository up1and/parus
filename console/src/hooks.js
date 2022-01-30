import { useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";


export function useToastMessage() {
  const [toastMessage, setToastMessage] = useState(undefined);
  const toast = useToast();

  useEffect(() => {
    if (toastMessage) {
      const { title, description, status } = toastMessage;

      toast({
        title: title,
        description: description,
        status: status,
      });
    }
  }, [toastMessage, toast]);

  return [toastMessage, setToastMessage];
}
