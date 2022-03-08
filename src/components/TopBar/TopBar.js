import { useState } from "react"
import { Offcanvas, OffcanvasBody } from "reactstrap"
import ChangeLangLink from "../ChangeLangLink"
import c2dh from "./assets/c2dh.svg"
import unilu from "./assets/unilu.svg"
import LangLink from "../LangLink"
import styles from "./TopBar.module.css"
import { useTranslation } from "react-i18next"
import { LANGS } from "../../i18n"

export default function TopBar({ right }) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  return (
    <>
      <div className={styles.TopBar}>
        <div>
          <i
            onClick={() => {
              setOpen(!open)
            }}
            style={{ fontSize: "2rem" }}
            className="bi bi-list cursor-pointer"
          />
        </div>
        <div>Minett Stories</div>
        {right ? right : <span />}
      </div>
      <Offcanvas
        isOpen={open}
        toggle={() => setOpen(!open)}
        className={styles.Offcanvas}
      >
        <OffcanvasBody className={styles.OffcanvasBody}>
          <LangLink className={styles.BigLink} to="/">
            {t("intro")}
          </LangLink>
          <LangLink className={styles.BigLink} to="/stories">
            {t("stories")}
          </LangLink>
          <LangLink className={styles.BigLink} to="/archive">
            {t("archive")}
          </LangLink>
          <LangLink className={styles.BigLink} to="/about">
            {t("about")}
          </LangLink>
          <div className={styles.OffcanvasBottom}>
            <div className={styles.BlockLanguages}>
              <ChangeLangLink
                className={
                  i18n.language === LANGS[0]
                    ? styles.ChangeLangLinkActive
                    : styles.ChangeLangLink
                }
                lang={LANGS[0]}
              >
                EN
              </ChangeLangLink>
              <ChangeLangLink
                className={
                  i18n.language === LANGS[1]
                    ? styles.ChangeLangLinkActive
                    : styles.ChangeLangLink
                }
                lang={LANGS[1]}
              >
                FR
              </ChangeLangLink>
              <ChangeLangLink
                className={
                  i18n.language === LANGS[2]
                    ? styles.ChangeLangLinkActive
                    : styles.ChangeLangLink
                }
                lang={LANGS[2]}
              >
                DE
              </ChangeLangLink>
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
