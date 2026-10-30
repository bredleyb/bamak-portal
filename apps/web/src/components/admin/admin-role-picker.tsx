"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Check, ChevronDown } from "lucide-react";

type Role = "ADMINISTRATOR" | "OPERATOR";

const roles: readonly { value: Role; label: string }[] = [
  { value: "OPERATOR", label: "Operador" },
  { value: "ADMINISTRATOR", label: "Administrador" },
];

export function AdminRolePicker() {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [value, setValue] = useState<Role>("OPERATOR");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedIndex = roles.findIndex(
    (role) => role.value === value,
  );

  const listId = `${id}-list`;

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleOutsidePointer(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        !rootRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "pointerdown",
      handleOutsidePointer,
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsidePointer,
      );
    };
  }, [open]);

  function selectRole(index: number) {
    setValue(roles[index].value);
    setActiveIndex(index);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
  ) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      if (!open) {
        setActiveIndex(selectedIndex);
        setOpen(true);
        return;
      }

      setActiveIndex((previous) =>
        event.key === "ArrowDown"
          ? (previous + 1) % roles.length
          : (previous - 1 + roles.length) % roles.length,
      );

      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (open) {
        selectRole(activeIndex);
      } else {
        setActiveIndex(selectedIndex);
        setOpen(true);
      }

      return;
    }

    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "Home" && open) {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === "End" && open) {
      event.preventDefault();
      setActiveIndex(roles.length - 1);
      return;
    }

    if (event.key === "Tab" && open) {
      setOpen(false);
    }
  }

  return (
    <div className="bamak-admin-users__role-picker">
      <span className="bamak-admin-users__role-label">
        Perfil
      </span>

      <div
        ref={rootRef}
        className="bamak-admin-users__select-wrap"
        onBlur={(event) => {
          if (
            !event.currentTarget.contains(
              event.relatedTarget,
            )
          ) {
            setOpen(false);
          }
        }}
      >
        <button
          ref={triggerRef}
          type="button"
          role="combobox"
          aria-label="Perfil"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={
            open
              ? `${listId}-option-${activeIndex}`
              : undefined
          }
          className="bamak-admin-users__role-trigger"
          onClick={() => {
            setActiveIndex(selectedIndex);
            setOpen((previous) => !previous);
          }}
          onKeyDown={handleKeyDown}
        >
          <span>{roles[selectedIndex].label}</span>

          <ChevronDown
            size={20}
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>

        <input
          type="hidden"
          name="role"
          value={value}
          readOnly
        />

        {open && (
          <div
            id={listId}
            role="listbox"
            aria-label="Perfil"
            className="bamak-admin-users__role-listbox"
          >
            {roles.map((role, index) => (
              <button
                key={role.value}
                id={`${listId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={role.value === value}
                tabIndex={-1}
                data-active={index === activeIndex}
                className="bamak-admin-users__role-option"
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectRole(index)}
              >
                <span>{role.label}</span>

                {role.value === value && (
                  <Check
                    size={18}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
