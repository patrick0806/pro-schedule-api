import { ConflictException, Injectable } from "@nestjs/common";
import { BusinessRepository } from "@shared/repositories/business.repository";
import { UserRepository } from "@shared/repositories/user.repository";
import { SignupRequestDTO } from "./dtos/request.dto";
import { SubscriptionRepository } from "@shared/repositories/subscription.repository";
import { Plan } from "@shared/entities/plan.entity";
import { SubscriptionStatus } from "@shared/enums/subscriptionStatus.enum";
import { addDays } from "date-fns";
import { env } from "process";
import { EmailService } from "@shared/providers";

@Injectable()
export class SignupService {
    constructor(
        private userRepository: UserRepository,
        private businessRepository: BusinessRepository,
        private subscriptionRepository: SubscriptionRepository,
        private emailService: EmailService,
    ) { }

    async execute(request: SignupRequestDTO): Promise<void> {
        const { business, user, planId } = request;
        const alreadyExistsBusiness = await this.businessRepository.findByPhoneNumber(business.whatsapp);
        if (alreadyExistsBusiness) {
            throw new ConflictException('Already exists a Business with this whatsapp');
        }

        const alreadyExistsUser = await this.userRepository.findByEmail(user.email);
        if (alreadyExistsUser) {
            throw new ConflictException('Already exists a User with this email');
        }

        const savedBusiness = await this.businessRepository.save({
            ...business,
            whatsapp: business.whatsapp.replace(/\D/g, ''),
        });

        await this.userRepository.save({
            ...user,
            business: savedBusiness
        });

        await this.subscriptionRepository.save({
            business: savedBusiness,
            plan: {
                id: planId
            } as Plan,
            status: SubscriptionStatus.TRIAL,
            renewsAt: addDays(new Date(), 14)
        })

        this.emailService.send(user.email, 'Bem vindo ao Pro schedule', 'welcome', {
            name: user.name,
            businessName: business.name,
        });
    }
}