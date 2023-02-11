import React from "react"
import useInviteResolver from "hooks/useInviteResolver";
import classNames from "classnames";
import Join from "components/Join";
import CollectorLayout from "pages/layouts/CollectorLayout";

const JoinPage = () => {

  useInviteResolver(true)

  return (
    <CollectorLayout requireAccess={false} pageTitle="JOIN DIAMOND DAWN">
      <div className={classNames("page join-page")}>
        <Join />
      </div>
    </CollectorLayout>
  )

}

export default JoinPage