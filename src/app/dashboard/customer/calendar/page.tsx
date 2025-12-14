import { ServiceCalendar } from "@/app/components/shared/calendar/Agenda";
import { Card, CardContent } from "@/app/components/ui/card";
import { sampleEvents } from "@/data/constants";
export default function Calendar() {
  return (
    <>
      <div className="grid  gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-blue-900 text-white rounded-[30px]">
          <CardContent className="flex flex-col items-center justify-between p-5">
            <div className="flex w-full justify-between items-center gap-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  Candidatures en attente
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-3xl font-bold">{12}</span>
                  <span className="text-xs text-primary-foreground/70">
                    {"+4 depuis hier"}
                  </span>
                </div>
              </div>
              <div className="">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    width="35"
                    height="35"
                    viewBox="0 0 35 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5013 2.91666C9.46588 2.91666 2.91797 9.46457 2.91797 17.5C2.91797 25.5354 9.46588 32.0833 17.5013 32.0833C25.5367 32.0833 32.0846 25.5354 32.0846 17.5C32.0846 9.46457 25.5367 2.91666 17.5013 2.91666ZM23.8451 22.7062C23.6409 23.0562 23.2763 23.2458 22.8971 23.2458C22.7076 23.2458 22.518 23.2021 22.343 23.0854L17.8221 20.3875C16.6992 19.7167 15.868 18.2437 15.868 16.9458V10.9667C15.868 10.3687 16.3638 9.87291 16.9617 9.87291C17.5596 9.87291 18.0555 10.3687 18.0555 10.9667V16.9458C18.0555 17.4708 18.493 18.2437 18.9451 18.5062L23.4659 21.2042C23.9909 21.5104 24.1659 22.1812 23.8451 22.7062Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900 rounded-[30px]">
          <CardContent className="flex flex-col items-center justify-between p-5">
            <div className="flex w-full justify-between items-center gap-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  Candidatures assignées
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-3xl font-bold">{2}</span>
                  <span className="text-xs text-primary-foreground/70">
                    {"+1 cette semaine"}
                  </span>
                </div>
              </div>
              <div className="">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    width="35"
                    height="35"
                    viewBox="0 0 35 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.7587 29.4C19.3796 29.5604 18.9712 29.7062 18.5337 29.8521L16.2296 30.6104C10.44 32.4771 7.39205 30.9167 5.5108 25.1271L3.64413 19.3667C1.77747 13.5771 3.3233 10.5146 9.11288 8.64791L11.3587 7.90416C11.0816 8.60416 10.8483 9.40624 10.6296 10.3104L9.20038 16.4208C7.59622 23.2896 9.94413 27.0812 16.8129 28.7146L19.2629 29.2979C19.4233 29.3417 19.5983 29.3708 19.7587 29.4Z"
                      fill="#F9C300"
                    />
                    <path
                      d="M25.0411 4.68124L22.6057 4.11249C17.7349 2.96041 14.8328 3.90832 13.1266 7.43749C12.6891 8.32707 12.3391 9.40624 12.0474 10.6458L10.6182 16.7562C9.18906 22.8521 11.0703 25.8562 17.1516 27.3L19.6016 27.8833C20.4474 28.0875 21.2349 28.2187 21.9641 28.2771C26.5141 28.7146 28.9349 26.5854 30.1599 21.3208L31.5891 15.225C33.0182 9.12916 31.1516 6.11041 25.0411 4.68124Z"
                      fill="#F9C300"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900 rounded-[30px]">
          <CardContent className="flex flex-col items-center justify-between p-5">
            <div className="flex w-full justify-between items-center gap-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  Candidatures assignées
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-3xl font-bold">{18}</span>
                  <span className="text-xs text-primary-foreground/70">
                    {"+1 cette semaine"}
                  </span>
                </div>
              </div>
              <div className="">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    width="35"
                    height="35"
                    viewBox="0 0 35 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24.9359 2.91666H18.8109C14.1393 2.91666 12.0452 4.63915 11.723 8.83129C11.6803 9.38657 12.1347 9.84374 12.6916 9.84374H16.1859C22.3109 9.84374 25.1547 12.6875 25.1547 18.8125V22.3068C25.1547 22.8637 25.6119 23.3181 26.1671 23.2755C30.3593 22.9532 32.0818 20.8591 32.0818 16.1875V10.0625C32.0818 4.95832 30.0401 2.91666 24.9359 2.91666Z"
                      fill="#00B500"
                    />
                    <path
                      d="M16.1888 11.6667H10.0638C4.95964 11.6667 2.91797 13.7083 2.91797 18.8125V24.9375C2.91797 30.0417 4.95964 32.0833 10.0638 32.0833H16.1888C21.293 32.0833 23.3346 30.0417 23.3346 24.9375V18.8125C23.3346 13.7083 21.293 11.6667 16.1888 11.6667ZM17.9242 19.9063L12.5138 25.3167C12.3096 25.5208 12.0471 25.6229 11.7701 25.6229C11.493 25.6229 11.2305 25.5208 11.0263 25.3167L8.3138 22.6042C7.90547 22.1958 7.90547 21.5396 8.3138 21.1313C8.72213 20.7229 9.37839 20.7229 9.78672 21.1313L11.7555 23.1L16.4367 18.4188C16.8451 18.0104 17.5013 18.0104 17.9096 18.4188C18.318 18.8271 18.3326 19.4979 17.9242 19.9063Z"
                      fill="#00B500"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900 rounded-[30px]">
          <CardContent className="flex flex-col items-center justify-between p-5">
            <div className="flex w-full justify-between items-center gap-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  Candidatures assignées
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-3xl font-bold">{3}</span>
                  <span className="text-xs text-primary-foreground/70">
                    {"+1 cette semaine"}
                  </span>
                </div>
              </div>
              <div className="">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    width="35"
                    height="35"
                    viewBox="0 0 35 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M30.7284 7.62707C28.3805 7.39374 26.0326 7.21874 23.6701 7.08749V7.07291L23.3492 5.17707C23.1305 3.83541 22.8096 1.82291 19.3971 1.82291H15.5763C12.1784 1.82291 11.8576 3.74791 11.6242 5.16249L11.318 7.02916C9.96172 7.11666 8.60547 7.20416 7.24922 7.33541L4.27422 7.62707C3.66172 7.68541 3.22422 8.22499 3.28256 8.82291C3.34089 9.42082 3.86589 9.85832 4.47839 9.79999L7.45339 9.50832C15.0951 8.74999 22.7951 9.04166 30.5242 9.81457C30.568 9.81457 30.5971 9.81457 30.6409 9.81457C31.1951 9.81457 31.6763 9.39166 31.7346 8.82291C31.7784 8.22499 31.3409 7.68541 30.7284 7.62707Z"
                      fill="#C20000"
                    />
                    <path
                      d="M28.0433 11.8708C27.6933 11.5062 27.2121 11.3021 26.7162 11.3021H8.28289C7.78705 11.3021 7.29122 11.5062 6.9558 11.8708C6.62039 12.2354 6.4308 12.7312 6.45997 13.2417L7.36414 28.2042C7.52455 30.4208 7.72872 33.1917 12.8183 33.1917H22.1808C27.2704 33.1917 27.4746 30.4354 27.635 28.2042L28.5391 13.2562C28.5683 12.7312 28.3787 12.2354 28.0433 11.8708ZM19.9204 25.8854H15.0641C14.4662 25.8854 13.9704 25.3896 13.9704 24.7917C13.9704 24.1937 14.4662 23.6979 15.0641 23.6979H19.9204C20.5183 23.6979 21.0141 24.1937 21.0141 24.7917C21.0141 25.3896 20.5183 25.8854 19.9204 25.8854ZM21.1454 20.0521H13.8537C13.2558 20.0521 12.76 19.5562 12.76 18.9583C12.76 18.3604 13.2558 17.8646 13.8537 17.8646H21.1454C21.7433 17.8646 22.2391 18.3604 22.2391 18.9583C22.2391 19.5562 21.7433 20.0521 21.1454 20.0521Z"
                      fill="#C20000"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="col-span-full">
          <ServiceCalendar events={sampleEvents} showPublishService={true} />
        </div>
      </div>
    </>
  );
}
