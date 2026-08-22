CREATE TABLE `announcement_reads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`announcementId` int NOT NULL,
	`userId` int NOT NULL,
	`readAt` bigint NOT NULL,
	CONSTRAINT `announcement_reads_id` PRIMARY KEY(`id`),
	CONSTRAINT `announcement_reads_unique` UNIQUE(`announcementId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `announcements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(140) NOT NULL,
	`body` text NOT NULL,
	`audience` enum('all','employees','admins') NOT NULL DEFAULT 'all',
	`isPinned` boolean NOT NULL DEFAULT false,
	`authorUserId` int,
	`publishedAt` bigint NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `announcements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `announcement_reads` ADD CONSTRAINT `announcement_reads_announcementId_announcements_id_fk` FOREIGN KEY (`announcementId`) REFERENCES `announcements`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `announcement_reads` ADD CONSTRAINT `announcement_reads_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `announcements` ADD CONSTRAINT `announcements_authorUserId_users_id_fk` FOREIGN KEY (`authorUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `announcement_reads_user_idx` ON `announcement_reads` (`userId`);--> statement-breakpoint
CREATE INDEX `announcements_audience_idx` ON `announcements` (`audience`);--> statement-breakpoint
CREATE INDEX `announcements_published_idx` ON `announcements` (`publishedAt`);