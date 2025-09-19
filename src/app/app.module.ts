import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TeachersComponent } from './teachers/teachers/teachers.component';
import { CreateComponent } from './teachers/create/create.component';
import { UpdateComponent } from './teachers/update/update.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { InvoiceListComponent } from './invoice/invoice-list/invoice-list.component';
import { InvoiceCreateComponent } from './invoice/invoice-create/invoice-create.component';
import { BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { InvoiceUpdateComponent } from './invoice/invoice-update/invoice-update.component';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from 'ckeditor4-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingComponent } from './setting/setting.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { InvoiceViewComponent } from './invoice/invoice-view/invoice-view.component';
import { CustomersComponent } from './customers/customers/customers.component';
import { CustomerCreateComponent } from './customers/customer-create/customer-create.component';
import { CustomerUpdateComponent } from './customers/customer-update/customer-update.component';
import { ClassesComponent } from './classes/classes/classes.component';
import { ClassCreateComponent } from './classes/class-create/class-create.component';
import { ClassUpdateComponent } from './classes/class-update/class-update.component';
import { SubjectsComponent } from './subjects/subjects/subjects.component';
import { SubjectCreateComponent } from './subjects/subject-create/subject-create.component';
import { SubjectUpdateComponent } from './subjects/subject-update/subject-update.component';
import { BoardComponent } from './borad/board/board.component';
import { BoardCreateComponent } from './borad/board-create/board-create.component';
import { BoardUpdateComponent } from './borad/board-update/board-update.component';
import { SlidersComponent } from './sliders/sliders/sliders.component';
import { SliderCreateComponent } from './sliders/slider-create/slider-create.component';
import { SliderUpdateComponent } from './sliders/slider-update/slider-update.component';
import { VideosComponent } from './videos/videos/videos.component';
import { VideoCreateComponent } from './videos/video-create/video-create.component';
import { VideoUpdateComponent } from './videos/video-update/video-update.component';
import { PartnersComponent } from './partners/partners/partners.component';
import { PartnerCreateComponent } from './partners/partner-create/partner-create.component';
import { PartnerUpdateComponent } from './partners/partner-update/partner-update.component';
import { TestimonialsComponent } from './testimonials/testimonials/testimonials.component';
import { TestimonialCreateComponent } from './testimonials/testimonial-create/testimonial-create.component';
import { TestimonialUpdateComponent } from './testimonials/testimonial-update/testimonial-update.component';
import { QuestionnairesComponent } from './questionnaires/questionnaires/questionnaires.component';
import { QuestionCreateComponent } from './questionnaires/question-create/question-create.component';
import { QuestionUpdateComponent } from './questionnaires/question-update/question-update.component';
import { StudentPackagesComponent } from './student_packages/student-packages/student-packages.component';
import { StudentPackageCreateComponent } from './student_packages/student-package-create/student-package-create.component';
import { StudentPackageUpdateComponent } from './student_packages/student-package-update/student-package-update.component';
import { TeacherPackagesComponent } from './teacher_packages/teacher-packages/teacher-packages.component';
import { TeacherPackageCreateComponent } from './teacher_packages/teacher-package-create/teacher-package-create.component';
import { TeacherPackageUpdateComponent } from './teacher_packages/teacher-package-update/teacher-package-update.component';
import { SettlementReportComponent } from './SettlementReport/settlement-report/settlement-report.component';
import { TeacherPayNowComponent } from './SettlementReport/teacher-pay-now/teacher-pay-now.component';
import { TeacherAddressesComponent } from './teacher-addresses/teacher-addresses/teacher-addresses.component';
import { TeacherAddressCreateComponent } from './teacher-addresses/teacher-address-create/teacher-address-create.component';
import { TeacherAddressUpdateComponent } from './teacher-addresses/teacher-address-update/teacher-address-update.component';
import { TeacherExamComponent } from './teachers/teacher-exam/teacher-exam.component';
import { CouponCodesComponent } from './coupon-codes/coupon-codes/coupon-codes.component';
import { CouponCodeCreateComponent } from './coupon-codes/coupon-code-create/coupon-code-create.component';
import { CouponCodeUpdateComponent } from './coupon-codes/coupon-code-update/coupon-code-update.component';
import { ContentsComponent } from './contents/contents/contents.component';
import { ContentCreateComponent } from './contents/content-create/content-create.component';
import { ContentUpdateComponent } from './contents/content-update/content-update.component';
import { FaqsComponent } from './faqs/faqs/faqs.component';
import { FaqCreateComponent } from './faqs/faq-create/faq-create.component';
import { FaqUpdateComponent } from './faqs/faq-update/faq-update.component';
import { StaticPagesComponent } from './static-pages/static-pages/static-pages.component';
import { StaticPageUpdateComponent } from './static-pages/static-page-update/static-page-update.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './orders/order-details/order-details.component';
import { IncentiveCreateComponent } from './incentive/incentive-create/incentive-create.component';
import { IncentivesComponent } from './incentive/incentives/incentives.component';
import { IncentiveUpdateComponent } from './incentive/incentive-update/incentive-update.component';
import { TutorRegistrationComponent } from './teachers/tutor-registration/tutor-registration.component';
import { TelecallerEnquiryComponent } from './teachers/telecaller-enquiry/telecaller-enquiry.component';
import { ViewTutorRegistrationComponent } from './teachers/view-tutor-registration/view-tutor-registration.component';
import { ViewTelecallerEnquiryComponent } from './teachers/view-telecaller-enquiry/view-telecaller-enquiry.component';
import { AppointmentsComponent } from './teachers/appointments/appointments.component';
import { ViewAppointmentComponent } from './teachers/view-appointment/view-appointment.component';
import { AccountsComponent } from './accounts/accounts/accounts.component';
import { AccountCreateComponent } from './accounts/account-create/account-create.component';
import { AccountUpdateComponent } from './accounts/account-update/account-update.component';
import { TutorEnquiryComponent } from './crm/tutor-enquiry/tutor-enquiry.component';
import { TaskManagerComponent } from './crm/task-manager/task-manager.component';
import { ActivityManagerComponent } from './crm/activity-manager/activity-manager.component';
import { InterviewDataComponent } from './crm/interview-data/interview-data.component';
import { DocFollowupDataComponent } from './crm/doc-followup-data/doc-followup-data.component';
import { FranchiseComponent } from './franchise/franchise.component';
import { ContactSupportComponent } from './contact-support/contact-support.component';
import { EditTutorRegistrationComponent } from './teachers/edit-tutor-registration/edit-tutor-registration.component';
import { MessageSamplesComponent } from './message-samples/message-samples.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { ReviewsComponent } from './reviews/reviews/reviews.component';
import { DeveloperTaskComponent } from './developer-task/developer-task.component';
import { ProgressReportComponent } from './progress-report/progress-report.component';
import { StatesComponent } from './states/states.component';
import { RevenueModalComponent } from './revenue-modal/revenue-modal.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { ViewContactSupportComponent } from './view-contact-support/view-contact-support.component';
import { PayoutsComponent } from './payouts/payouts.component';
import { FindTutorComponent } from './find-tutor/find-tutor.component';
import { FindPackageComponent } from './find-package/find-package.component';
import { StudentEnquiryComponent } from './crm-student/student-enquiry/student-enquiry.component';
import { StudentTaskComponent } from './crm-student/student-task/student-task.component';
import { StudentActivitiesComponent } from './crm-student/student-activities/student-activities.component';
import { HomeLocationsComponent } from './home-locations/home-locations.component';
import { PayableComponent } from './payable/payable.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    ChangePasswordComponent,
    ProfileComponent,
    ForgotPasswordComponent,
    TeachersComponent,
    CreateComponent,
    UpdateComponent,
    InvoiceListComponent,
    InvoiceCreateComponent,
    InvoiceUpdateComponent,
    SettingComponent,
    InvoiceViewComponent,
    CustomersComponent,
    CustomerCreateComponent,
    CustomerUpdateComponent,
    ClassesComponent,
    ClassCreateComponent,
    ClassUpdateComponent,
    SubjectsComponent,
    SubjectCreateComponent,
    SubjectUpdateComponent,
    BoardComponent,
    BoardCreateComponent,
    BoardUpdateComponent,
    SlidersComponent,
    SliderCreateComponent,
    SliderUpdateComponent,
    VideosComponent,
    VideoCreateComponent,
    VideoUpdateComponent,
    PartnersComponent,
    PartnerCreateComponent,
    PartnerUpdateComponent,
    TestimonialsComponent,
    TestimonialCreateComponent,
    TestimonialUpdateComponent,
    QuestionnairesComponent,
    QuestionCreateComponent,
    QuestionUpdateComponent,
    StudentPackagesComponent,
    StudentPackageCreateComponent,
    StudentPackageUpdateComponent,
    TeacherPackagesComponent,
    TeacherPackageCreateComponent,
    TeacherPackageUpdateComponent,
    SettlementReportComponent,
    TeacherPayNowComponent,
    TeacherAddressesComponent,
    TeacherAddressCreateComponent,
    TeacherAddressUpdateComponent,
    TeacherExamComponent,
    CouponCodesComponent,
    CouponCodeCreateComponent,
    CouponCodeUpdateComponent,
    ContentsComponent,
    ContentCreateComponent,
    ContentUpdateComponent,
    FaqsComponent,
    FaqCreateComponent,
    FaqUpdateComponent,
    StaticPagesComponent,
    StaticPageUpdateComponent,
    OrdersComponent,
    OrderDetailsComponent,
    IncentiveCreateComponent,
    IncentivesComponent,
    IncentiveUpdateComponent,
    TutorRegistrationComponent,
    TelecallerEnquiryComponent,
    ViewTutorRegistrationComponent,
    ViewTelecallerEnquiryComponent,
    AppointmentsComponent,
    ViewAppointmentComponent,
    AccountsComponent,
    AccountCreateComponent,
    AccountUpdateComponent,
    TutorEnquiryComponent,
    TaskManagerComponent,
    ActivityManagerComponent,
    InterviewDataComponent,
    DocFollowupDataComponent,
    FranchiseComponent,
    ContactSupportComponent,
    EditTutorRegistrationComponent,
    MessageSamplesComponent,
    BookingDetailsComponent,
    ReviewsComponent,
    DeveloperTaskComponent,
    ProgressReportComponent,
    StatesComponent,
    RevenueModalComponent,
    CampaignsComponent,
    ViewContactSupportComponent,
    PayoutsComponent,
    FindTutorComponent,
    FindPackageComponent,
    StudentEnquiryComponent,
    StudentTaskComponent,
    StudentActivitiesComponent,
    HomeLocationsComponent,
    PayableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    CKEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
