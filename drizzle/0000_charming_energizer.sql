CREATE TABLE `attendance_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`workDate` bigint NOT NULL,
	`checkInAt` bigint,
	`checkOutAt` bigint,
	`status` enum('present','absent','half_day','leave') NOT NULL DEFAULT 'present',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `attendance_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `attendance_employee_day_unique` UNIQUE(`employeeId`,`workDate`)
);
--> statement-breakpoint
CREATE TABLE `employee_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`employeeCode` varchar(32) NOT NULL,
	`fullName` varchar(120) NOT NULL,
	`department` varchar(120),
	`jobTitle` varchar(120),
	`phone` varchar(40),
	`address` text,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employee_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `employee_profiles_user_unique` UNIQUE(`userId`),
	CONSTRAINT `employee_profiles_code_unique` UNIQUE(`employeeCode`)
);
--> statement-breakpoint
CREATE TABLE `leave_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`leaveType` enum('paid','sick','unpaid') NOT NULL,
	`startAt` bigint NOT NULL,
	`endAt` bigint NOT NULL,
	`note` text,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`reviewerId` int,
	`reviewerComment` text,
	`reviewedAt` bigint,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leave_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payroll_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`periodStartAt` bigint NOT NULL,
	`grossPayCents` int NOT NULL,
	`netPayCents` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`paymentStatus` enum('draft','finalized') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payroll_records_id` PRIMARY KEY(`id`),
	CONSTRAINT `payroll_employee_period_unique` UNIQUE(`employeeId`,`periodStartAt`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
ALTER TABLE `attendance_entries` ADD CONSTRAINT `attendance_entries_employeeId_employee_profiles_id_fk` FOREIGN KEY (`employeeId`) REFERENCES `employee_profiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_profiles` ADD CONSTRAINT `employee_profiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leave_requests` ADD CONSTRAINT `leave_requests_employeeId_employee_profiles_id_fk` FOREIGN KEY (`employeeId`) REFERENCES `employee_profiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leave_requests` ADD CONSTRAINT `leave_requests_reviewerId_users_id_fk` FOREIGN KEY (`reviewerId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_records` ADD CONSTRAINT `payroll_records_employeeId_employee_profiles_id_fk` FOREIGN KEY (`employeeId`) REFERENCES `employee_profiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `attendance_work_date_idx` ON `attendance_entries` (`workDate`);--> statement-breakpoint
CREATE INDEX `employee_profiles_department_idx` ON `employee_profiles` (`department`);--> statement-breakpoint
CREATE INDEX `leave_requests_employee_idx` ON `leave_requests` (`employeeId`);--> statement-breakpoint
CREATE INDEX `leave_requests_status_idx` ON `leave_requests` (`status`);--> statement-breakpoint
CREATE INDEX `payroll_period_idx` ON `payroll_records` (`periodStartAt`);