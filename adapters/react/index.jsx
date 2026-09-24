/**
 * React adapter — thin components over components/components.css.
 * No dependencies beyond React. Copy this file into your project, or import it
 * through your bundler (it's plain JSX).
 *
 *   import "<kit>/tokens/base.css";
 *   import "<kit>/skins/studio.css";
 *   import "<kit>/components/components.css";
 *   import { SkinProvider, Button, Field } from "<kit>/adapters/react/index.jsx";
 *
 *   <SkinProvider skin="studio" mode="auto">
 *     <Button variant="primary">Start a 30-day trial</Button>
 *   </SkinProvider>
 */
import { createContext, useContext, useEffect, useId } from "react";

const cx = (...parts) => parts.filter(Boolean).join(" ");

const SkinContext = createContext({ skin: "studio", mode: "auto" });
export const useSkin = () => useContext(SkinContext);

/** Sets data-skin / data-mode on <html> so skins and portals (dialogs, toasts) all match. */
export function SkinProvider({ skin, mode = "auto", children }) {
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.skin = skin;
    if (mode === "auto") delete html.dataset.mode;
    else html.dataset.mode = mode;
  }, [skin, mode]);
  return <SkinContext.Provider value={{ skin, mode }}>{children}</SkinContext.Provider>;
}

/** variant: "default" | "primary" | "ghost"; size: "sm" | "md" | "lg". Renders <a> when href is set. */
export function Button({ variant = "default", size = "md", href, className, type = "button", ...props }) {
  const cls = cx("btn", variant !== "default" && `btn--${variant}`, size !== "md" && `btn--${size}`, className);
  return href ? <a className={cls} href={href} {...props} /> : <button className={cls} type={type} {...props} />;
}

/** tone: "neutral" | "accent" | "success" | "warning" | "danger" */
export function Badge({ tone = "neutral", dot = false, className, children, ...props }) {
  return (
    <span className={cx("badge", tone !== "neutral" && `badge--${tone}`, className)} {...props}>
      {dot && <span className="dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

/** variant: "default" | "flat" | "well". Renders <a> when href is set. */
export function Card({ variant = "default", href, className, ...props }) {
  const cls = cx("card", variant !== "default" && `card--${variant}`, className);
  return href ? <a className={cls} href={href} {...props} /> : <div className={cls} {...props} />;
}

/** Label, hint and error are wired to the input with ids and aria attributes. */
export function Field({ label, hint, error, as = "input", id, className, ...inputProps }) {
  const autoId = useId();
  const fieldId = id || autoId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const Control = as;
  const controlClass = as === "textarea" ? "textarea" : as === "select" ? "select" : "input";
  return (
    <div className={cx("field", className)}>
      <label htmlFor={fieldId}>{label}</label>
      <Control
        id={fieldId}
        className={controlClass}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
        {...inputProps}
      />
      {hint && <p className="hint" id={hintId}>{hint}</p>}
      {error && <p className="error" id={errorId}>{error}</p>}
    </div>
  );
}

/** trend: "up" | "down" | undefined — colors the delta line. */
export function Stat({ label, value, delta, trend }) {
  return (
    <div className="stat">
      <span className="stat__label">{label}</span>
      <span className="stat__value">{value}</span>
      {delta && <span className={cx("stat__delta", trend ? `stat__delta--${trend}` : "muted")}>{delta}</span>}
    </div>
  );
}

/** tone: "default" | "danger" */
export function Callout({ tone = "default", className, ...props }) {
  return <div className={cx("callout", tone === "danger" && "callout--danger", className)} role={tone === "danger" ? "alert" : undefined} {...props} />;
}

export function Eyebrow({ as: Tag = "span", className, ...props }) {
  return <Tag className={cx("eyebrow", className)} {...props} />;
}
