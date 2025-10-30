"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon, X } from "lucide-react";
import { useState } from "react";

type SearchInputProps = {
  placeholder?: string;
  setSearchTerm: (value: string) => void;
  className?: string;
};
export default function SearchInput({
  placeholder,
  setSearchTerm,
  className,
}: SearchInputProps) {
  const [value, setValue] = useState("");
  return (
    <InputGroup className={className}>
      <InputGroupInput
        placeholder={placeholder ?? "Search..."}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setSearchTerm(e.target.value);
        }}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      {value.length > 0 && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={() => {
              setValue("");
              setSearchTerm("");
            }}
          >
            <X /> Clear
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
