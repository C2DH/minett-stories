import { useState } from "react"
import { Offcanvas, OffcanvasBody } from "reactstrap"
import ChangeLangLink from "../ChangeLangLink"
import c2dh from "./assets/c2dh.svg"
import unilu from "./assets/unilu.svg"
import LangLink from "../LangLink"
import styles from "./TopBar.module.css"
import { useTranslation } from "react-i18next"
import { LANGS } from "../../i18n"
import NavLangLink from "../NavLangLink"
import classNames from "classnames"

function LinkTop({ label, to }) {
  return (
    <NavLangLink
      className={({ isActive }) =>
        isActive ? styles.BigLinkAction : styles.BigLink
      }
      to={to}
    >
      {label}
    </NavLangLink>
  )
}

export default function TopBar({ right }) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  return (
    <>
      <div className={styles.TopBar}>
        <div className="position-absolute left-topbar">
          <i
            onClick={() => {
              setOpen(!open)
            }}
            style={{ fontSize: "2rem" }}
            className={classNames("bi cursor-pointer", {
              "bi-list": !open,
              "bi-x-lg": open
            })}
          />
        </div>
        <div>Minett Stories</div>
        {right ? right : <span />}
      </div>
      <Offcanvas
        backdrop={false}
        isOpen={open}
        toggle={() => setOpen(!open)}
        className={styles.Offcanvas}
      >
        <OffcanvasBody className={styles.OffcanvasBody}>
          <LinkTop to="/" label={t("intro")} />
          <LinkTop to="/stories" label={t("stories")} />
          <LinkTop to="/archive" label={t("archive")} />
          <LinkTop to="/about" label={t("about")} />
          <div className={styles.OffcanvasBottom}>
            <div className={styles.BlockLanguages}>
              {LANGS.map((lang) => (
                <ChangeLangLink
                  key={lang}
                  className={
                    i18n.language === lang
                      ? styles.ChangeLangLinkActive
                      : styles.ChangeLangLink
                  }
                  lang={lang}
                >
                  {lang.split("_")[0]}
                </ChangeLangLink>
              ))}
            </div>
            <div className={styles.BlockTerms}>
              <div>
                <LangLink className={styles.MediumLink} to="/">
                  {t("terms_of_use")}
                </LangLink>
              </div>
              <div>
                <LangLink className={styles.MediumLink} to="/stories">
                  {t("contact_us")}
                </LangLink>
              </div>
            </div>
            <div>
              <img
                src={c2dh}
                className={styles.c2dh}
                alt="Luxembourg Centre for Contemporary and digital History"
              />
              <img
                src={unilu}
                className={styles.logoUnilu}
                alt="Universitè du Luxembourg"
              />
            </div>
          </div>
        </OffcanvasBody>
      </Offcanvas>
    </>
  )
}
