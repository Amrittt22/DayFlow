CREATE TABLE `hr_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`requestType` enum('document','access','policy','support') NOT NULL,
	`priority` enum('standard','high') NOT NULL DEFAULT 'standard',
	`subject` varchar(160) NOT NULL,
	`details` text NOT NULL,
	`status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
	`assignedAdminId` int,
	`resolution` text,
	`resolvedAt` bigint,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hr_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `hr_requests` ADD CONSTRAINT `hr_requests_employeeId_employee_profiles_id_fk` FOREIGN KEY (`employeeId`) REFERENCES `employee_profiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hr_requests` ADD CONSTRAINT `hr_requests_assignedAdminId_users_id_fk` FOREIGN KEY (`assignedAdminId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `hr_requests_employee_idx` ON `hr_requests` (`employeeId`);--> statement-breakpoint
CREATE INDEX `hr_requests_status_idx` ON `hr_requests` (`status`);--> statement-breakpoint
CREATE INDEX `hr_requests_created_idx` ON `hr_requests` (`createdAt`);