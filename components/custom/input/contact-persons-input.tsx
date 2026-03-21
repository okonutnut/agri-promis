"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { useState } from "react";

type ContactPerson = {
  name: string;
  position: string;
};

type ContactPersonsInputProps = {
  label?: string;
  value?: ContactPerson[];
  onChange?: (contacts: ContactPerson[]) => void;
};

export default function ContactPersonsInput({
  label = "Contact Persons",
  value = [],
  onChange,
}: ContactPersonsInputProps) {
  const [contacts, setContacts] = useState<ContactPerson[]>(value);
  const [newName, setNewName] = useState("");
  const [newPosition, setNewPosition] = useState("");

  const addContact = () => {
    if (newName.trim()) {
      const updated = [...contacts, { name: newName.trim(), position: newPosition.trim() }];
      setContacts(updated);
      onChange?.(updated);
      setNewName("");
      setNewPosition("");
    }
  };

  const removeContact = (index: number) => {
    const updated = contacts.filter((_, i) => i !== index);
    setContacts(updated);
    onChange?.(updated);
  };

  return (
    <div className="space-y-2">
      <Label className="capitalize mb-1 block text-sm font-semibold">
        {label}
      </Label>
      <div className="space-y-2">
        {contacts.map((contact, index) => (
          <div key={index} className="flex items-center gap-2 bg-secondary p-2 rounded-md">
            <div className="flex-1">
              <p className="text-sm font-medium">{contact.name}</p>
              {contact.position && (
                <p className="text-xs text-muted-foreground">{contact.position}</p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => removeContact(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Position (optional)"
            value={newPosition}
            onChange={(e) => setNewPosition(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={addContact}
            disabled={!newName.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}