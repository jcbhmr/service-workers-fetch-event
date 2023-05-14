/**
 * An event handler IDL attribute is an IDL attribute for a specific event
 * handler. The name of the IDL attribute is the same as the name of the event
 * handler.
 */
export default function defineEventHandlerIDLAttribute<
  T extends EventTarget,
  N extends `on${string}`
>(target: T, name: N): T {
  // For both of these two ways, the event handler is exposed through a name,
  // which is a string that always starts with "on" and is followed by the name
  // of the event for which the handler is intended.
  const type = name.match(/^on(.*)$/)![1];
  const eventHandler = new WeakMap<T, EventListener | null | undefined>();
  return Object.defineProperty(target, name, {
    get() {
      // The getter of an event handler IDL attribute with name name, when called, must run these steps:

      // 1. Let eventTarget be the result of determining the target of an event handler given this object and name.
      const eventTarget = this;

      // 2. If eventTarget is null, then return null.
      if (eventTarget === null) {
        return null;
      }

      // 3. Return the result of getting the current value of the event handler given eventTarget and name.
      return eventHandler.get(eventTarget) ?? null;
    },
    set(value: EventListener | null) {
      if (typeof value !== "object" && typeof value !== "function") {
        value = null;
      }

      // The setter of an event handler IDL attribute with name name, when called, must run these steps:

      // 1. Let eventTarget be the result of determining the target of an event handler given this object and name.
      const eventTarget = this;

      // 2. If eventTarget is null, then return.
      if (eventTarget === null) {
        return;
      }

      // 3. If the given value is null, then deactivate an event handler given eventTarget and name.
      if (value == null) {
        this.removeEventListener(type, eventHandler.get(eventTarget)!);
        eventHandler.set(eventTarget, null);
        return;
      }

      // 4. Otherwise:
      else {
        // 1. Let handlerMap be eventTarget's event handler map.
        // 2. Let eventHandler be handlerMap[name].
        // 3. Set eventHandler's value to the given value.
        // 4. Activate an event handler given eventTarget and name.
        this.removeEventListener(type, eventHandler.get(eventTarget)!);
        if (typeof value === "function") {
          this.addEventListener(type, value);
        }
        eventHandler.set(eventTarget, value);
      }
    },
    enumerable: true,
    configurable: true,
  });
}
